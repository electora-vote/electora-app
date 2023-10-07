import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt } from "@graphprotocol/graph-ts"
import { ballotCreated } from "../generated/schema"
import { ballotCreated as ballotCreatedEvent } from "../generated/BallotManager/BallotManager"
import { handleballotCreated } from "../src/ballot-manager"
import { createballotCreatedEvent } from "./ballot-manager-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let _ballotId = "Example string value"
    let name = "Example string value"
    let endTime = BigInt.fromI32(234)
    let sismoGroupId = "Example string value"
    let candidateGroupId = "Example string value"
    let dkgRitualId = 123
    let protocolVersion = 123
    let newballotCreatedEvent = createballotCreatedEvent(
      _ballotId,
      name,
      endTime,
      sismoGroupId,
      candidateGroupId,
      dkgRitualId,
      protocolVersion
    )
    handleballotCreated(newballotCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ballotCreated created and stored", () => {
    assert.entityCount("ballotCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ballotCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_ballotId",
      "Example string value"
    )
    assert.fieldEquals(
      "ballotCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "ballotCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "endTime",
      "234"
    )
    assert.fieldEquals(
      "ballotCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sismoGroupId",
      "Example string value"
    )
    assert.fieldEquals(
      "ballotCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "candidateGroupId",
      "Example string value"
    )
    assert.fieldEquals(
      "ballotCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "dkgRitualId",
      "123"
    )
    assert.fieldEquals(
      "ballotCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "protocolVersion",
      "123"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
