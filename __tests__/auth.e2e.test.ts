import { clearTestDb, closeTestDb, connectToTestDb, createNewEntity, createNewUser1, createNewUser2 } from "./mongo-datasets"
import { req } from './test-helpers';
import { SETTINGS } from '../src/settings'

describe('/auth', () => {

    beforeAll(async () => {
        await connectToTestDb()
        // await req.delete('/testing/all-data')

    })
    beforeEach(async () => {
        await clearTestDb()
    })
    afterAll(async () => {
        await closeTestDb()
    })

    //должен авторизоваться
    it('should get autorization', async () => {
        //создаем нового user
        const newUser1 = createNewUser1
        const res = await createNewEntity(newUser1, SETTINGS.PATH.USERS)

        const authUser = {
            loginOrEmail: `${newUser1.login}`,
            password: `${newUser1.password}`,
        }
        const res1 = await req
            .post(SETTINGS.PATH.AUTH + '/login')
            .send(authUser)
            .expect(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
    })

    //не должен авторизоваться
    it('shouldn\'t get autorization', async () => {
        //создаем нового user
        const newUser1 = createNewUser1
        const res = await createNewEntity(newUser1, SETTINGS.PATH.USERS)

        const authUser = {
            loginOrEmail: `${newUser1.login}`,
            password: 'somePassword',
        }
        const res1 = await req
            .post(SETTINGS.PATH.AUTH + '/login')
            .send(authUser)
            .expect(SETTINGS.HTTP_STATUSES.UNAUTHORIZED_401)
    })

    //не должен авторизоваться из-за некорректных данных
    it('shouldn\'t get autorization because uncorrect data', async () => {
        //создаем нового user
        const newUser1 = createNewUser1
        const res = await createNewEntity(newUser1, SETTINGS.PATH.USERS)

        const authUser = {
            loginOrEmail: `ghj@hgjhgj-hgj`,
            password: `${newUser1.password}`,
        }
        const res1 = await req
            .post(SETTINGS.PATH.AUTH + '/login')
            .send(authUser)
            .expect(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)
    })
})