import * as outlier from '../../src/dash/Outlier'
import DataFrame from '../../src/common/DataFrame'
import tests from './data/outlierTest.json'
import events from './data/outlierEvents.json'

test('Test Outlier.getBaseData() > ', async () => {

    const df = new DataFrame(events)
    const details = outlier.getBaseData(df, tests.tasks)
    expect(details.length).toBe(8)
})


test('Test Outlier.l2() > ', async () => {

    let d = outlier.l2([1,1], [1,1])
    expect(d).toBe(0)

    d = outlier.l2([0,0], [1,1])
    expect(d).toBe(Math.sqrt(2))

    d = outlier.l2([0,0], [3,3])
    expect(d).toBe(Math.sqrt(18))
})


test('Test Outlier.getZScore() > ', async () => {

    const m = [
        [1, 4, 6],
        [4, 1, 6],
        [3, 9, 1]
    ]
    const result = outlier.getZScore(m)

})

test('Test Outlier.getMinMaxScore() > ', async () => {

    let m = [
        [10],
        [5],
        [0]
    ]
    let result = outlier.getMinMaxScore(m)
    expect(result[0][0]).toBe(1)
    expect(result[1][0]).toBe(0.5)
    expect(result[2][0]).toBe(0)

    m = [
        [10, 0],
        [5, 10],
        [0, 20]
    ]
    result = outlier.getMinMaxScore(m)

    expect(result[0][0]).toBe(1)
    expect(result[1][0]).toBe(0.5)
    expect(result[2][0]).toBe(0)

    expect(result[0][1]).toBe(0)
    expect(result[1][1]).toBe(0.5)
    expect(result[2][1]).toBe(1)


    result = outlier.getMinMaxScore(m, 100)

    expect(result[0][0]).toBe(100)
    expect(result[1][0]).toBe(50)
    expect(result[2][0]).toBe(0)

    expect(result[0][1]).toBe(0)
    expect(result[1][1]).toBe(50)
    expect(result[2][1]).toBe(100)

})


test('Test Outlier.getPairwiseDistance() > ', async () => {
    const sessions = [
        {
          "session": "S1682027294746_1077",
          "interactions": 5,
          "duration": 4,
          "screens":2,
          "errors": 0,
          "t1682028415961": 1,
          "t1682268100433": 1,
          "t1682268114645": 0
        },
        {
          "session": "S1682027311457_808",
          "interactions": 3,
          "duration": 2,
          "screens": 2,
          "errors": 0,
          "t1682028415961": 1,
          "t1682268100433": 1,
          "t1682268114645": 0
        },
        {
          "session": "S1682027326890_6650",
          "interactions": 0,
          "duration": 0,
          "screens": 2,
          "errors": 0,
          "t1682028415961": 1,
          "t1682268100433": 0,
          "t1682268114645": 0
        }
      ]
    const matrix = outlier.getMatrix(sessions, ['interactions', 'duration'])
    const dist = outlier.getPairwiseDistance(matrix)
    expect(dist.length).toBe(3)
    expect(dist[0][0]).toBe(1)
    expect(dist[1][1]).toBe(1)
    expect(dist[2][2]).toBe(1)

    expect(dist[0][1]).toBe(Math.sqrt(8)) // (5-3 * 5 - 3) + (4-2 * 4 - 2) = 8

})