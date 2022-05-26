const EternalStorage = artifacts.require("EternalStorage")
const ballotLib = artifacts.require("ballotLib")
const Ballot = artifacts.require("Ballot")
const ballotLib2 = artifacts.require("ballotLib2")
const Ballot2 = artifacts.require("Ballot2")

const Upgradeable = artifacts.require("Upgradeable")
const Dispatcher = artifacts.require("Dispatcher")
const Example = artifacts.require("Example")
const ExampleUpgrade = artifacts.require("ExampleUpgrade")

module.exports = async function (deployer) {
  /* ETERNAL STORAGE */
  /* Deployment */
  await deployer.deploy(EternalStorage)
  const eternalStorage = await EternalStorage.deployed()

  await deployer.deploy(ballotLib)
  await deployer.link(ballotLib, Ballot)

  await deployer.deploy(Ballot, eternalStorage.address)
  const ballot = await Ballot.deployed()

  /* Upgraded Deploys */
  await deployer.deploy(ballotLib2)
  await deployer.link(ballotLib2, Ballot2)

  await deployer.deploy(Ballot2, eternalStorage.address)
  const ballot2 = await Ballot2.deployed()
  

  /* FIRST PROXY */
  await deployer.deploy(Example)
  const example = await Example.deployed()

  await deployer.deploy(Dispatcher, example.address)
  const dispatcher = await Dispatcher.deployed()
  const example2 = await Example.at(dispatcher.address)

  /* Upgrade Example Contract */
  const exampleUpgrade = await ExampleUpgrade.at(dispatcher.address)
};
