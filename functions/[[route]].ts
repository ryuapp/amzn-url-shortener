import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono()

app.get('/', (c) => {
  return c.text('🪓Amzn URL shortener')
}).post('/', async (c) => {
  const { url } = await c.req.json<{ url: string }>()
  const domainRegex = /([a-zA-Z]{2,}):\/\/(smile.|www.|)amazon.(ae|au|ca|cn|de|es|eg|fr|in|it|jp|mx|nl|pr|sa|se|sg|co.jp|co.uk|com|com.be|com.br|com.mx|com.tr)/
  const pathRegex = /\/dp\/\S*(\/|\?)/
  const lastRegex = /(\/|\?)$/
  const domainName = url.match(domainRegex)
  const pathName = url.match(pathRegex)
  if (!domainName) {
    return c.json({
      message: 'Invalid amazon url',
    })
  }
  if (!pathName) {
    return c.json({
      message: 'Can\'t shorten the url',
    })
  }
  const shortenURL = (domainName[0] + pathName[0]).replace(lastRegex, '')
  return c.json({ url: shortenURL })
})

export const onRequest = handle(app)
