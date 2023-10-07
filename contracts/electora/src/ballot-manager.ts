import {
  ballotCreated as ballotCreatedEvent,
  candidateAdded as candidateAddedEvent
} from "../generated/BallotManager/BallotManager"
import { ballotCreated, candidateAdded } from "../generated/schema"

export function handleballotCreated(event: ballotCreatedEvent): void {
  let entity = new ballotCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ballotId = event.params.ballotId.toHexString()
  entity.name = event.params.name
  entity.endTime = event.params.endTime
  entity.sismoGroupId = event.params.sismoGroupId
  entity.candidateGroupId = event.params.candidateGroupId
  entity.dkgRitualId = event.params.dkgRitualId
  entity.protocolVersion = event.params.protocolVersion

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlecandidateAdded(event: candidateAddedEvent): void {
  let entity = new candidateAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ballotId = event.params.ballotId.toHexString()
  entity.title = event.params.title
  entity.description = event.params.description
  entity.proof = event.params.proof
  entity.invoice = event.params.invoice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
