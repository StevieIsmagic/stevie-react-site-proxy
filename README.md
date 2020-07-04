# Instagram Proxy API 

An access token can be used anywhere by anyone to do anything that the access token has permissions to do.

By using server-side token refresh, we never expose our user's access token client-side. 

Our [[client website](https://www.stevenocampo.com/)] makes calls to the proxy server.

Proxy then makes calls to Instagram on behalf of client .

**

## Why was the CORS error there in the first place ?

[[Read / Discuss this article with teammates](https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9)]

[[CORS WIKI](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)]

[[Cross-Document Messaging](https://en.wikipedia.org/wiki/Web_Messaging)]