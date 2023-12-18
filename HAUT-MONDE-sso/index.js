import express from 'express'
import 'dotenv/config'
import router from './routes/index.js'
import morgan from 'morgan'
import { WorkOS } from '@workos-inc/node'

const app = express()

const port = process.env.PORT || 8000

app.use('/public', express.static('public'))

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

app.use(morgan('dev'))

app.use('/', router)

app.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at https://localhost:${port}`)
})

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID;

app.get('/auth', (_req, res) => {
  // The user's organization ID
  const organization = 'ENTER_YOUR_ORGID_HERE';

  // The callback URI WorkOS should redirect to after the authentication
  const redirectURI = 'http://localhost:8000/callback';

  const authorizationUrl = workos.sso.getAuthorizationURL({
    organization,
    redirectURI,
    clientId,
  });

  res.redirect(authorizationUrl);
});

app.get('/callback', async (req, res) => {
    const { code } = req.query;
  
    const { profile } = await workos.sso.getProfileAndToken({
      code,
      clientId,
    });
  
    // Use the information in `profile` for further business logic.
  
    res.redirect('/');
  });

