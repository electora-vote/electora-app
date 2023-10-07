import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import {
  ballotCreated,
  candidateAdded
} from "../generated/BallotManager/BallotManager"

export function createballotCreatedEvent(
  ballotId: string,
  name: string,
  endTime: BigInt,
  sismoGroupId: string,
  candidateGroupId: string,
  dkgRitualId: i32,
  protocolVersion: i32
): ballotCreated {
  let ballotCreatedEvent = changetype<ballotCreated>(newMockEvent())

  ballotCreatedEvent.parameters = new Array()

  ballotCreatedEvent.parameters.push(
    new ethereum.EventParam("ballotId", ethereum.Value.fromString(ballotId))
  )
  ballotCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  ballotCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )
  ballotCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "sismoGroupId",
      ethereum.Value.fromString(sismoGroupId)
    )
  )
  ballotCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "candidateGroupId",
      ethereum.Value.fromString(candidateGroupId)
    )
  )
  ballotCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "dkgRitualId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(dkgRitualId))
    )
  )
  ballotCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "protocolVersion",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(protocolVersion))
    )
  )

  return ballotCreatedEvent
}

export function createcandidateAddedEvent(
  ballotId: string,
  title: string,
  description: string,
  proof: string,
  invoice: string
): candidateAdded {
  let candidateAddedEvent = changetype<candidateAdded>(newMockEvent())

  candidateAddedEvent.parameters = new Array()

  candidateAddedEvent.parameters.push(
    new ethereum.EventParam("ballotId", ethereum.Value.fromString(ballotId))
  )
  candidateAddedEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  candidateAddedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  candidateAddedEvent.parameters.push(
    new ethereum.EventParam("proof", ethereum.Value.fromString(proof))
  )
  candidateAddedEvent.parameters.push(
    new ethereum.EventParam("invoice", ethereum.Value.fromString(invoice))
  )

  return candidateAddedEvent
}
