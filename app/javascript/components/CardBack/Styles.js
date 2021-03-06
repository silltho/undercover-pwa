import styled from 'styled-components'
import { PINK } from 'styles/variables'
import CardBack from 'assets/images/cardback.svg'

export const ImageWrapper = styled.div`
    display: flex;
    flex: 1;
    border-radius: 8px;
    border: solid 1px ${PINK};
    justify-content: center;
    position: relative;
    
    &:after {
      z-index: -1;
      position: absolute;
      border-radius: 8px;
      width: 100%;
      height: 100%;
      content: '';
      opacity: 0.5;
      background-color: #a61921;
      background-image: repeating-linear-gradient(120deg, rgba(255,255,255,.1), rgba(255,255,255,.1) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(60deg, rgba(255,255,255,.1), rgba(255,255,255,.1) 1px, transparent 1px, transparent 60px), linear-gradient(60deg, rgba(0,0,0,.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1)), linear-gradient(120deg, rgba(0,0,0,.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1));
      background-size: 70px 120px;
      left: 50%;
      background-repeat: repeat;
      transform: translateX(-50%);
    }
    
    > img {
      max-width: 70%;
      object-fit: contain;
    }
`

export const CardBackText = styled.div`
  position: absolute;
  bottom: 2.5rem;
  font-size: 2.5rem;
  color: ${PINK};
  left: 50%;
  transform: translateX(-50%);
`

export const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`
