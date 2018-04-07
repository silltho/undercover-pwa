require 'rails_helper'
require 'aasm/rspec'

RSpec.describe Game, type: :model do
  let!(:game) { Game.new }

  it 'is valid with valid attributes' do
    expect(game).to be_valid
  end

  it 'creates a valid game code' do
    code = game.create_game_code
    expect(code.length).to eql(4)
    expect(code).to be_a_kind_of(String)
    expect(code).not_to match('/[a-zA-Z]+/')
  end

  it 'has a valid game code' do
    game = Game.create
    expect(game.code.length).to eql(4)
    expect(game.code).to be_a_kind_of(String)
  end

  it 'changes from waiting to initialized' do
    game = Game.create(id: 2)
    expect(game).to have_state(:waiting)
    expect(game).to allow_event :initializing
    expect(game).not_to have_state(:initialized)
    expect(game).to transition_from(:waiting).to(:initialized).on_event(:initializing)
    expect(game).to have_state(:initialized)
  end

  it 'changes from initialized to inform' do
    game = Game.create(id: 3)
    game.initializing!
    expect(game).to have_state(:initialized)
    expect(game).to allow_event :started
    expect(game).not_to have_state(:inform)
    expect(game).to transition_from(:initialized).to(:inform).on_event(:started)
    expect(game).to have_state(:inform)
  end

  it 'changes from inform to exchanged' do
    game = Game.create(id: 4)
    game.initializing!
    game.started!
    expect(game).to have_state(:inform)
    expect(game).to allow_event :informed
    expect(game).not_to have_state(:exchange)
    expect(game).to transition_from(:inform).to(:exchange).on_event(:informed)
    expect(game).to have_state(:exchange)
  end

  it 'changes from exchanged to activity' do
    game = Game.create(id: 5)
    game.initializing!
    game.started!
    game.informed!
    expect(game).to have_state(:exchange)
    expect(game).to allow_event :exchanged
    expect(game).not_to have_state(:activity)
    expect(game).to transition_from(:exchange).to(:activity).on_event(:exchanged)
    expect(game).to have_state(:activity)
  end

  it 'changes from activity to informed' do
    game = Game.create(id: 6)
    game.initializing!
    game.started!
    game.informed!
    game.exchanged!
    expect(game).to have_state(:activity)
    expect(game).to allow_event :skills_used
    expect(game).not_to have_state(:inform)
    expect(game).to transition_from(:activity).to(:inform).on_event(:skills_used)
    expect(game).to have_state(:inform)
  end

  it 'is full if 9 players have joined' do
    game = Game.create(id: 7)
    8.times do
     p = Player.new
     game.players << p
    end
    expect(game.full).to be false
    p = Player.new
    game.players << p
    expect(game.full).to be true
  end

  it 'updates the round' do
    game = Game.create(id: 8)
    expect(game.round).to eql(1)
    game.update_round
    expect(game.round).to eql(2)
  end

  it 'adds players to the game' do
    game = Game.create(id: 10)
    expect(game.players.count).to eql(0)
    game.players << Player.create
    expect(game.players.count).to eql(1)
    game.players << Player.create
    expect(game.players.count).to eql(2)
  end

  it 'only allows unique game codes' do
    game = Game.create(id: 11)
    expect(game.unique_game_code(game.code)).to be false
    expect(game.unique_game_code(game.create_game_code)).to be true
  end

  it 'assigns roles and code-names to players' do
    Role.create(id: 1, name: "Godfather", power: 4)
    Role.create(id: 2, name: "President", power: 4)
    Role.create(id: 3, name: "Junior", power: 4)
    game = Game.create(id: 12)
    expect(game.players.count).to eql(0)
    p1 = Player.create(id: 4)
    p2 = Player.create(id: 5)
    game.players << p1
    game.players << p2
    expect(game.players.count).to eql(2)
    expect(p1.role).to be_nil
    expect(p2.role).to be_nil
    expect(p1.codename).to be_nil
    expect(p2.codename).to be_nil
    game.init_game
    p1.reload
    p2.reload
    expect(p1.role).not_to be_nil
    expect(p2.role).not_to be_nil
    expect(p1.codename).not_to be_nil
    expect(p2.codename).not_to be_nil
    expect(p1.relations).not_to be_nil
    expect(p2.relations).not_to be_nil
  end

  it 'returns an array with articles' do
    game = Game.create(id: 14)
    expect(game.players.count).to eql(0)
    p1 =  Player.create(id: 3)
    p2 = Player.create(id: 4)
    game.players << p1
    game.players << p2
    game.initializing!
    game.use_skill(p1.id, p2.id)
    expect(game.create_stories(1)).to be_an_instance_of(Array)
  end

  it 'can use a skill on another player' do
    p1 = Player.create(id: 3)
    p2 = Player.create(id: 4)
    g = Game.create(id: 13)
    g.players << p1
    g.players << p2
    g.init_game
    expect(g).to receive(:create_article)
    expect(g).to receive(:create_article)
    g.use_skill(p1.id, p2.id)
    g.use_skill(p2.id, p1.id)
  end

  it 'can kill any player as Junior' do
    gf = Role.create(name: "Godfather", id: 1)
    bg = Role.create(name: "Bodyguard", id: 2)
    jr = Role.create(name: "Junior", id: 3)
    ag = Role.create(name: "Agent", id: 4)
    p1 = Player.create(id: 5, role: gf)
    p2 = Player.create(id: 6, role: jr)
    p3 = Player.create(id: 7, role: bg)
    p4 = Player.create(id: 8, role: ag)
    g = Game.create(id: 15)
    g.players << p1
    g.players << p2
    g.players << p3
    g.players << p4
    expect(g.calculate_success(p2.id, p4.id)).to be true
    expect(g.calculate_success(p2.id, p1.id)).to be true
    expect(g.calculate_success(p2.id, p3.id)).to be true
  end

  it "can't convert or corrupt the head of the other fraction" do
    gf = Role.create(name: "Godfather", id: 1)
    pr = Role.create(name: "President", id: 2)
    p1 = Player.create(id: 5, role: gf)
    p2 = Player.create(id: 6, role: pr)
    g = Game.create(id: 15)
    g.players << p1
    g.players << p2
    expect(g.calculate_success(p1.id, p2.id)).to be false
    expect(g.calculate_success(p2.id, p1.id)).to be false
    expect(p1.changed_party).to be false
    expect(p2.changed_party).to be false
  end

  it "can convert or corrupt a player of the other fraction" do
    gf = Role.create(name: "Godfather", id: 1, party: "Mafia")
    pr = Role.create(name: "President", id: 2, party: "Town")
    ag = Role.create(name: "Agent", id: 3, party: "Town")
    bb = Role.create(name: "Beagle Boy", id: 4, party: "Mafia")
    p1 = Player.create(id: 5, role: gf, changed_party: false)
    p2 = Player.create(id: 6, role: pr, changed_party: false)
    p3 = Player.create(id: 7, role: ag, changed_party: false)
    p4 = Player.create(id: 8, role: bb, changed_party: false)
    g = Game.create(id: 17)
    g.add_player(p1)
    g.add_player(p2)
    g.add_player(p3)
    g.add_player(p4)
    expect(g.calculate_success(p2.id, p3.id)).to be false
    expect(p3.changed_party).to be false
    expect(g.calculate_success(p1.id, p3.id)).to be true
    p3.reload
    expect(p3.changed_party).to be true
    expect(g.calculate_success(p1.id, p4.id)).to be false
    expect(p4.changed_party).to be false
    expect(g.calculate_success(p2.id, p4.id)).to be true
    p4.reload
    expect(p4.changed_party).to be true
  end
end
