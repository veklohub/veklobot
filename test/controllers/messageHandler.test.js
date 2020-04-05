const expect = require('chai').expect;
const sinon = require('sinon');

const messageHandler = require('../../src/controllers/messageHandler');
const commands = require('../../src/consts/commands');

// requires of exchangeRateGetter
const logger = require('../../src/common/logger');
const exchangeRate = require('../../src/controllers/exchangeRate');
const jobs = require('../../src/controllers/jobs');

describe('messageHandler', function() {

    let sandbox;
    let loggernWarnMock;
    let getUSDRateMock;
    let startUSDRateJobMock;

    before(() => {
        sandbox = sinon.createSandbox();
        loggernWarnMock = sandbox.stub(logger, 'warn');
        getUSDRateMock = sandbox.stub(exchangeRate, 'getUSDRate');
        startUSDRateJobMock = sandbox.stub(jobs, 'startUSDRateJob');
    });

    after(() => {
        sandbox.restore();
    });
    
    describe('if message is undefined', () => {
        before(() => {
            loggernWarnMock.returns();
            getUSDRateMock.resolves();
            startUSDRateJobMock.returns();
            messageHandler();
        });

        after(() => {
            sandbox.reset();
        });
        
        it('should write warn to log', function() {
            expect(loggernWarnMock.calledOnce).to.be.true;
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateMock.notCalled).to.be.true;
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(startUSDRateJobMock.notCalled).to.be.true;
        });
    });

    describe('if message is empty', () => {
        before(() => {
            loggernWarnMock.returns();
            getUSDRateMock.resolves();
            startUSDRateJobMock.returns();
            messageHandler({});
        });

        after(() => {
            sandbox.reset();
        });

        it('should write warn to log', function() {
            expect(loggernWarnMock.calledOnce).to.be.true;
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateMock.notCalled).to.be.true;
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(startUSDRateJobMock.notCalled).to.be.true;
        });
    });

    describe('if message is without chat object', () => {
        before(() => {
            loggernWarnMock.returns();
            getUSDRateMock.resolves();
            startUSDRateJobMock.returns();
            messageHandler({
                text: 'SOME_TEXT',
                from: {}
            });
        });

        after(() => {
            sandbox.reset();
        });

        it('should write warn to log', function() {
            expect(loggernWarnMock.calledOnce).to.be.true;
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateMock.notCalled).to.be.true;
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(startUSDRateJobMock.notCalled).to.be.true;
        });
    });

    describe('if message is without chat id', () => {
        before(() => {
            loggernWarnMock.returns();
            getUSDRateMock.resolves();
            startUSDRateJobMock.returns();
            messageHandler({
                text: 'SOME_TEXT',
                from: {
                    is_bot: false
                },
                chat: {}
            });
        });

        after(() => {
            sandbox.reset();
        });

        it('should write warn to log', function() {
            expect(loggernWarnMock.calledOnce).to.be.true;
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateMock.notCalled).to.be.true;
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(startUSDRateJobMock.notCalled).to.be.true;
        });
    });

    describe('if message is without text', () => {
        before(() => {
            loggernWarnMock.returns();
            getUSDRateMock.resolves();
            startUSDRateJobMock.returns();
            messageHandler({
                from: {
                    is_bot: false
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        after(() => {
            sandbox.reset();
        });

        it('should write warn to log', function() {
            expect(loggernWarnMock.calledOnce).to.be.true;
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateMock.notCalled).to.be.true;
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(startUSDRateJobMock.notCalled).to.be.true;
        });
    });

    describe('if message is without from object', () => {
        before(() => {
            loggernWarnMock.returns();
            getUSDRateMock.resolves();
            startUSDRateJobMock.returns();
            messageHandler({
                text: commands.DOLLAR_RATE,
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        after(() => {
            sandbox.reset();
        });

        it('should write warn to log', function() {
            expect(loggernWarnMock.calledOnce).to.be.true;
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateMock.notCalled).to.be.true;
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(startUSDRateJobMock.notCalled).to.be.true;
        });
    });

    describe('if message is from bot', () => {
        before(() => {
            loggernWarnMock.returns();
            getUSDRateMock.resolves();
            startUSDRateJobMock.returns();
            messageHandler({
                text: commands.DOLLAR_RATE,
                from: {
                    is_bot: true
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        after(() => {
            sandbox.reset();
        });

        it('should write warn to log', function() {
            expect(loggernWarnMock.calledOnce).to.be.true;
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateMock.notCalled).to.be.true;
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(startUSDRateJobMock.notCalled).to.be.true;
        });
    });

    describe('if text is SOME_TEXT', () => {
        before(() => {
            loggernWarnMock.returns();
            getUSDRateMock.resolves();
            startUSDRateJobMock.returns();
            messageHandler({
                text: 'SOME_TEXT',
                from: {
                    is_bot: false
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        after(() => {
            sandbox.reset();
        });

        it('shouldn\'t write warn to log', function() {
            expect(loggernWarnMock.notCalled).to.be.true;
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateMock.notCalled).to.be.true;
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(startUSDRateJobMock.notCalled).to.be.true;
        });
    });

    describe('if text is /dollar_rate', () => {
        before(() => {
            loggernWarnMock.returns();
            getUSDRateMock.resolves();
            startUSDRateJobMock.returns();
            messageHandler({
                text: commands.DOLLAR_RATE,
                from: {
                    is_bot: false
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        after(() => {
            sandbox.reset();
        });

        it('shouldn\'t write warn to log', function() {
            expect(loggernWarnMock.notCalled).to.be.true;
        });

        it('should get USD rate', function() {
            expect(getUSDRateMock.calledOnce).to.be.true;
        });

        it('should set up USD rate job', function() {
            expect(startUSDRateJobMock.calledOnce).to.be.true;
        });
    });
});
