import { setupTestRunner } from '@keystone-next/keystone/testing'
import config from '../../../keystone'

const runner = setupTestRunner({ config })

describe('team tests', () => {
  it(
    'should adding a team member with the wrong gender',
    runner(async ({ context }) => {
      const team = await context.query.Team.createOne({
        data: { teamName: 'team male', teamType: 'MALE' },
      })

      await expect(
        context.query.Athlete.createOne({
          data: {
            firstName: 'test',
            lastName: 'test 1',
            gender: 'FEMALE',
            birthYear: 1990,
            team: { connect: { id: team.id } },
          },
        })
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
              "You provided invalid data for this operation.
                - Athlete.gender: The gender for athlete (FEMALE) does not match to the teamType MALE of team team male"
            `)
    })
  )
})
