require 'rails_helper'
require 'aasm/rspec'

RSpec.describe Player, type: :model do
  let!(:player) { Player.new }

  it 'sets a random codename' do
    expect(player.codename).to be_nil
    expect(player.create_codename).not_to be_nil
  end

  it 'assigns a role to the player' do
    expect(player.role).to be_nil
    expect(player.assign_character(Role.last)).not_to be_nil
  end

  it 'has no game at the beginning' do
    expect(player.game).to be_nil
  end

  it 'is alive at the beginning' do
    expect(player).to have_state(:alive)
  end

  it 'can be imprisoned' do
    expect(player).to have_state(:alive)
    expect(player).to allow_event :imprison
    expect(player).not_to have_state(:imprisoned)
    expect(player).to transition_from(:alive).to(:imprisoned).on_event(:imprison)
    expect(player).to have_state(:imprisoned)
  end

  it 'can die if in prison' do
    user = User.new(id: 1, session_id: 1234)
    player = Player.new(user: user)
    player.imprison!
    expect(player).to have_state(:imprisoned)
    expect(player).to allow_event :die
    expect(player).not_to have_state(:dead)
    expect(player).to transition_from(:imprisoned).to(:dead).on_event(:die)
    expect(player).to have_state(:dead)
  end

  it 'can die if alive' do
    player = Player.new
    expect(player).to have_state(:alive)
    expect(player).to allow_event :die
    expect(player).not_to have_state(:dead)
    expect(player).to transition_from(:alive).to(:dead).on_event(:die)
    expect(player).to have_state(:dead)
  end

  it 'can be converted or corrupted aka change party' do
    u1 = User.create(id: 1, session_id: 54245)
    player = Player.new(id: 1, user: u1, changed_party: false)
    expect(player.changed_party).to be false
    player.change_party!
    expect(player.changed_party).to be true
  end

  it 'can reveal its identity' do
    gf = Role.create(name: "Godfather")
    bg = Role.create(name: "Bodyguard")
    p1 =  Player.create(id: 6, role: gf)
    p2 = Player.create(id: 7, role: bg)
    expect(p1.role).not_to be_nil
    expect(p2.role).not_to be_nil
    expect(p2.relations).to be_empty
    p1.reveal_identity(p2)
    expect(p2.relations).not_to be_empty
    expect(p1.relations).to be_empty
    p2.reveal_identity(p1)
    expect(p1.relations).not_to be_empty
  end

  it 'can spy on or blackmail other players' do
    gf = Role.create(name: "Godfather", id: 1, party: "Mafia", active: "corrupt", passive: "immunity")
    pr = Role.create(name: "President", id: 2, party: "Town", active: "convert", passive: "immunity")
    sp = Role.create(name: "Agent", id: 3, party: "Town", active: "spy")
    bg = Role.create(name: "Bodyguard", id: 4, party: "Mafia", active: "blackmail")
    u1 = User.create(id: 1, session_id: 1111)
    u2 = User.create(id: 2, session_id: 2222)
    u3 = User.create(id: 3, session_id: 4234)
    u4 = User.create(id: 4, session_id: 2324)
    p1 =  Player.create(id: 1, user: u1, role: gf)
    p2 = Player.create(id: 2, user: u2, role: pr)
    p3 =  Player.create(id: 3, user: u3, role: sp)
    p4 = Player.create(id: 4, user: u4, role: bg)
    g = Game.new
    expect(g.calculate_success(p4.id, p2.id)).to be true
  end

  it 'gets its relations as Godfather' do
    gf = Role.create(name: "Godfather", id: 1)
    bg = Role.create(name: "Bodyguard", id: 2)
    u1 = User.create(id: 1, session_id: 1111)
    u2 = User.create(id: 2, session_id: 2222)
    p1 = Player.create(role: gf, user: u1, id: 8, codename: "player1")
    p2 = Player.create(role: bg, user: u2, id: 9, codename: "player2")
    g = Game.create(id: 1)
    g.add_player(p1)
    g.add_player(p2)
    expect(p1.relations).to be_empty
    p1.get_relations(g)
    expect(p1.relations).not_to be_empty
    expect(p1.relations.count).to eql(1)
    expect(p1.relations.first.first).to eql(9)
  end

  it 'gets its relations as Chief' do
    ch = Role.create(name: "Chief")
    of = Role.create(name: "Officer")
    pr = Role.create(name: "President")
    u1 = User.create(id: 1, session_id: 1111)
    u2 = User.create(id: 2, session_id: 2222)
    u3 = User.create(id: 3, session_id: 4234)
    p1 = Player.create(role: ch, user: u1, id: 10, codename: "player1")
    p2 = Player.create(role: of, user: u2, id: 11, codename: "player2")
    p3 = Player.create(role: pr, user: u3, id: 12, codename: "player3")
    g = Game.create(id: 1)
    g.add_player(p1)
    g.add_player(p2)
    g.add_player(p3)
    expect(p1.relations).to be_empty
    p1.get_relations(g)
    expect(p1.relations).not_to be_empty
    expect(p1.relations.count).to eql(2)
  end

  it 'gets its relations as Junior' do
    jr = Role.create(name: 'Junior')
    p = Player.create(role: jr, id: 13, codename: 'Giftmischer')
    u1 = User.create(id: 1, session_id: 1111)
    g = Game.create(id: 1)
    g.add_player(p)
    expect(p.relations).to be_empty
    p.get_relations(g)
    expect(p.relations).to be_empty
  end

  it 'test query relation information' do
    ch = Role.create(name: "Chief", id: 1)
    of = Role.create(name: "Officer", id: 2)
    pr = Role.create(name: "President", id: 3)
    u1 = User.create(id: 1, session_id: 1111)
    u2 = User.create(id: 2, session_id: 2222)
    u3 = User.create(id: 3, session_id: 4234)
    p1 = Player.create(role: ch, user: u1, id: 10, codename: "player1", relations: [])
    p2 = Player.create(role: of, user: u2, id: 11, codename: "player2", relations: [])
    p3 = Player.create(role: pr, user: u3, id: 12, codename: "player3", relations: [])
    g = Game.create(id: 1)
    g.add_player(p1)
    g.add_player(p2)
    g.add_player(p3)
    #puts(p1.query_relation_information("Chief", g))
    #puts(p1.query_relation_information("President", g))
    #puts(p1.query_relation_information("Officer", g))
    expect(p1.relations).to be_empty
    p1.get_relations(g)
    puts p1.relations
    expect(p1.relations).not_to be_empty
  end
end
