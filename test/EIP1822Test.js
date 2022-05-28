const EIP1822Final = artifacts.require("EIP1822Final")
const EIP1822Proxy = artifacts.require("EIP1822Proxy")

const BN = web3.utils.BN
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BN)).should()


let uint
let address

contract('EIP1822', accounts => {

    beforeEach(async () => {

        this.eip1822final = await EIP1822Final.new()
        this.eip1822Proxy = await EIP1822Proxy.new(0x473be604, this.eip1822final.address)
        this.eip1822final2 = await EIP1822Final.at(this.eip1822final.address)

    })

    describe('Upgrading Proxy Contracts', () => {

        it('Should be able to update integer', async () => {
            await this.eip1822final.increment()
            uint = await this.eip1822final.myUint()
            assert.equal(uint, 1)
        })
        
        it('Should update the integer in 2nd contract', async () => {
            await this.eip1822final2.increment()
            uint = await this.eip1822final2.myUint()
            assert.equal(uint, 1)
        })
        
        it('Should keep previous integer after upgrade', async () => {
            await this.eip1822final.increment()
            uint = await this.eip1822final.myUint()
            assert.equal(uint, 1)

            this.eip1822finalUpgrade = await EIP1822Final.at(this.eip1822final.address)

            await this.eip1822finalUpgrade.increment()
            uint = await this.eip1822finalUpgrade.myUint()
            assert.equal(uint, 2)
        })
        
        it('Should keep changes made after upgrade', async () => {
            await this.eip1822final.increment()
            uint = await this.eip1822final.myUint()
            assert.equal(uint, 1)

            this.eip1822finalUpgrade = await EIP1822Final.at(this.eip1822final.address)

            await this.eip1822finalUpgrade.increment()
            uint = await this.eip1822finalUpgrade.myUint()
            assert.equal(uint, 2)

            await this.eip1822final.increment()
            uint = await this.eip1822final.myUint()
            assert.equal(uint, 3)

            await this.eip1822finalUpgrade.increment()
            uint = await this.eip1822finalUpgrade.myUint()
            assert.equal(uint, 4)
        })
    })

})