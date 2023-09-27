import { differenceInPercentage } from '../../src/utils/math'

describe('differenceInPercentage', () => {
  it('should return the difference in percentage between two numbers', () => {
    expect(differenceInPercentage(1, 1)).toBe(0)
    expect(differenceInPercentage(150, 100)).toBe(50)
    expect(differenceInPercentage(200, 50)).toBe(300)
    expect(differenceInPercentage(1.5, 1)).toBe(50)
    expect(differenceInPercentage(1, 0)).toBe(Infinity)
  })
})
