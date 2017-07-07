{ logger } = require '../dist'


describe 'logger', ->

  it 'should set up label correctly', ->
    logger.label.should.endWith 'logger_test.coffee'

  it 'should allow to reset label with number', ->
    logger.resetLabel 2
    logger.label.should.endWith 'runnable.js'

  it 'should allow to reset label with string', ->
    logger.resetLabel 'label'
    logger.label.should.be.equal 'label'
