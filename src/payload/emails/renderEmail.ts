export const renderEmail = (content: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            background-color: #0a0c10;
            background-image: url('https://pub-b55794ef97244983a5bce9f2b8a8d9ab.r2.dev/hockey1.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            color: #ffffff;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 8px 32px 0 rgba(0,0,0,0.5);
          }
          .title {
            font-size: 32px;
            font-weight: 900;
            font-style: italic;
            text-transform: uppercase;
            color: #ffffff;
            margin-bottom: 24px;
            letter-spacing: -1px;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.85);
            margin-bottom: 32px;
          }
          .button {
            display: inline-block;
            padding: 16px 32px;
            background-color: #eab308;
            color: #000000;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: transform 0.2s;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
            text-transform: uppercase;
            letter-spacing: 2px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${content}
        </div>
      </body>
    </html>
  `
}
