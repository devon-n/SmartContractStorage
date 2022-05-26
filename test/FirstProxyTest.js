const Upgradeable = artifacts.require("Upgradeable")
const Dispatcher = artifacts.require("Dispatcher")
const Example = artifacts.require("Example")
const ExampleUpgrade = artifacts.require("ExampleUpgrade")

const BN = web3.utils.BN
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BN)).should()


let uint
contract('Dispatcher', accounts => {

    beforeEach(async () => {

        this.example = await Example.new()
        this.dispatcher = await Dispatcher.new(this.example.address)
        this.example2 = await Example.at(this.dispatcher.address)
        this.exampleUpgrade = await ExampleUpgrade.new()

    })

    describe('Upgrading Proxy Contracts', () => {

        it('Should be able to update integer', async () => {
            await this.example2.setUint(1)
            uint = await this.example2.getUint()
            assert.equal(uint, 1)
        })
        
        it('Should not update the integer in both contracts', async () => {
            await this.example2.setUint(1)
            uint = await this.example2.getUint()
            assert.equal(uint, 1)

            uint = await this.example.getUint()
            assert.equal(uint, 0)
        })
        
        it('Should upgrade the contract and return double the integer', async () => {
            await this.example2.setUint(1)
            uint = await this.example2.getUint()
            assert.equal(uint, 1)

            await this.dispatcher.replace(this.exampleUpgrade.address)

            uint = await this.example2.getUint()
            assert.equal(uint, 2)
        })
    })

})