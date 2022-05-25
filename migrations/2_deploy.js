const EternalStorage = artifacts.require("EternalStorage")
const ballotLib = artifacts.require("ballotLib")
const Ballot = artifacts.require("Ballot")

module.exports = async function (deployer) {
  /* Deployment */
  await deployer.deploy(EternalStorage)
  const eternalStorage = await EternalStorage.deployed()

  await deployer.deploy(ballotLib)
  await deployer.link(ballotLib, Ballot)

  await deployer.deploy(Ballot, eternalStorage.address)
  const ballot = await Ballot.deployed()

  /* Interaction */
};
