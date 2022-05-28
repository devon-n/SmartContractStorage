const EternalStorage = artifacts.require("EternalStorage")
const ballotLib = artifacts.require("ballotLib")
const Ballot = artifacts.require("Ballot")
const ballotLib2 = artifacts.require("ballotLib2")
const Ballot2 = artifacts.require("Ballot2")

const Upgradeable = artifacts.require("Upgradeable")
const Dispatcher = artifacts.require("Dispatcher")
const Example = artifacts.require("Example")
const ExampleUpgrade = artifacts.require("ExampleUpgrade")

const EIP897Proxy = artifacts.require("EIP897Proxy")
const EIP897Storage = artifacts.require("EIP897Storage")
const EIP897Proxy2 = artifacts.require("EIP897Proxy2")

const EIP1822Final = artifacts.require("EIP1822Final")
const EIP1822Proxy = artifacts.require("EIP1822Proxy")

const fs = require('fs');
const contract = JSON.parse(fs.readFileSync('NoConstructor', 'utf8'));
console.log(JSON.stringify(contract.abi));

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

  /* EIP897 Upgrade Standard */
  await deployer.deploy(EIP897Storage)
  const eip897Storage = await EIP897Storage.deployed()

  await deployer.deploy(EIP897Proxy2, EIP897Storage.address)
  const eip897Proxy2 = await EIP897Proxy2.deployed()

  const eip897Storage2 = await EIP897Storage.at(eip897Proxy2.address)

  /* EIP1822 Upgrade Standard */
  await deployer.deploy(EIP1822Final)
  const eip1822Final = await EIP1822Final.deployed()

  await deployer.deploy(EIP1822Proxy, 0x473be604, eip1822Final.address)
  const eip1822Proxy = await EIP1822Proxy.deployed()

  const eip1822Final2 = await EIP1822Final.at(eip1822Proxy.address)
};
