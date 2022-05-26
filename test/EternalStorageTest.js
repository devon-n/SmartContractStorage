const EternalStorage = artifacts.require("EternalStorage")
const BallotLib = artifacts.require("ballotLib")
const Ballot = artifacts.require("Ballot")
const BallotLib2 = artifacts.require("ballotLib2")
const Ballot2 = artifacts.require("Ballot2")

const BN = web3.utils.BN
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BN)).should()

let voteTotal
contract('EternalStorage', accounts => {


    beforeEach(async () => {
        this.eternalStorage = await EternalStorage.new()
        
        this.ballotLib = await BallotLib.new()
        await Ballot.link(BallotLib, this.ballotLib.address)
        this.ballot = await Ballot.new(this.eternalStorage.address)
        
        this.ballotLib2 = await BallotLib2.new()
        await Ballot2.link(BallotLib2, this.ballotLib2.address)
        this.ballot2 = await Ballot2.new(this.eternalStorage.address)
    })

    describe('Upgrading Proxy Contracts', () => {
        it('Should be able to vote', async () => {
            voteTotal = await this.ballot.getNumberOfVotes()
            assert.equal(voteTotal, 0)

            await this.ballot.vote()

            voteTotal = await this.ballot.getNumberOfVotes()
            assert.equal(voteTotal, 1)
        })
        
        it('Should be able to vote from the new contract', async () => {
            voteTotal = await this.ballot2.getNumberOfVotes()
            assert.equal(voteTotal, 0)

            await this.ballot2.vote()

            voteTotal = await this.ballot2.getNumberOfVotes()
            assert.equal(voteTotal, 1)
        })
        
        it('Should be able to vote from both contracts', async () => {
            voteTotal = await this.ballot.getNumberOfVotes()
            assert.equal(voteTotal, 0)

            await this.ballot.vote()

            voteTotal = await this.ballot.getNumberOfVotes()
            assert.equal(voteTotal, 1)

            await this.ballot2.vote()

            voteTotal = await this.ballot2.getNumberOfVotes()
            assert.equal(voteTotal, 2)
        })
        
        it('Should be able to vote multiple times only the first contract', async () => {
            voteTotal = await this.ballot.getNumberOfVotes()
            assert.equal(voteTotal, 0)

            await this.ballot.vote()

            voteTotal = await this.ballot.getNumberOfVotes()
            assert.equal(voteTotal, 1)

            await this.ballot2.vote()

            voteTotal = await this.ballot2.getNumberOfVotes()
            assert.equal(voteTotal, 2)

            await this.ballot.vote()

            voteTotal = await this.ballot.getNumberOfVotes()
            assert.equal(voteTotal, 3)

            await this.ballot2.vote().should.be.rejectedWith('revert')

            voteTotal = await this.ballot2.getNumberOfVotes()
            assert.equal(voteTotal, 3)
        })
    })

})