console.log('main initialized');

// const response1 = fetch('https://localhost:9500/', {
//   method: 'GET',
//   mode: 'cors',
//   credentials: 'include',
//   //importance: 'high',
//   headers: {
//     'Cache-Control': 'max-age=16'
//   }
// }).then(response => response.json()).then(json => {
//   console.log(json);
// });

setTimeout(() => {
  const response2 = fetch('https://localhost:9500/', {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    //importance: 'high',
    headers: {
      'Cache-Control': 'max-age=16'
    }
  }).then(response => response.json()).then(json => {
    console.log(json);
  });
}, 20);