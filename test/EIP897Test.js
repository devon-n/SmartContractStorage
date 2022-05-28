const EIP897Proxy = artifacts.require("EIP897Proxy")
const EIP897Storage = artifacts.require("EIP897Storage")
const EIP897Proxy2 = artifacts.require("EIP897Proxy2")

const BN = web3.utils.BN
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BN)).should()


let uint
let address

contract('EIP897', accounts => {

    beforeEach(async () => {

        this.eip897Storage = await EIP897Storage.new()
        this.eip897Proxy2 = await EIP897Proxy2.new(this.eip897Storage.address)
        this.eip897Storage2 = await EIP897Storage.at(this.eip897Storage.address)

    })

    describe('Upgrading Proxy Contracts', () => {

        /* Deploy
            Update first proxy
            Deploy second proxy
            Check numbers */

        it('Should be able to update integer and address in first contract', async () => {
            await this.eip897Storage.setUint(1)
            await this.eip897Storage.setAddress(accounts[0])
            uint = await this.eip897Storage.myUint()
            address = await this.eip897Storage.myAddress()
            assert.equal(uint, 1)
            assert.equal(address, accounts[0])
        })
        
        it('Should update the integer in 2nd contract', async () => {
            await this.eip897Storage2.setUint(2)
            await this.eip897Storage2.setAddress(accounts[1])
            uint = await this.eip897Storage2.myUint()
            address = await this.eip897Storage2.myAddress()
            assert.equal(uint, 2)
            assert.equal(address, accounts[1])
        })
        
        it('Should Keep previous integer and address after upgrade', async () => {
            await this.eip897Storage.setUint(1)
            await this.eip897Storage.setAddress(accounts[0])
            uint = await this.eip897Storage.myUint()
            address = await this.eip897Storage.myAddress()
            assert.equal(uint, 1)
            assert.equal(address, accounts[0])

            this.eip897StorageUpgrade = await EIP897Storage.at(this.eip897Storage.address)

            uint = await this.eip897Storage2.myUint()
            address = await this.eip897Storage2.myAddress()
            assert.equal(uint, 1)
            assert.equal(address, accounts[0])
        })
    })

})