import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import createConfigToken from './create-config-token.js';
import './App.css';

function App() {
  const [pageId, setPageId] = useState(0);
  const LP_SECRET = process.env.REACT_APP_LP_SECRET; // To populate this variable, run "REACT_APP_LP_SECRET=mySecretApiKey npm start" in the console. Only works in dev environment.

  const waitForGlobal = (key, callback) => {
    if (window[key]) {
      callback();
    } else {
      setTimeout(() => {
        waitForGlobal(key, callback);
      }, 100);
    }
  };

  const handleNextPage = () => {
    // Wait for global function
    waitForGlobal('removePaywall', () => {
      window.removePaywall();
      setTimeout(() => {
        setPageId( !pageId ? 1 : 0 );
      }, 50);
    });
  }

  const pagesData = [
    "Pitchfork cloud bread before they sold out tacos austin tofu mumblecore cornhole forage direct trade air plant ethical. I'm baby distillery bitters celiac pug pork belly sustainable. 3 wolf moon XOXO hell of occupy woke unicorn farm-to-table deep v taiyaki mixtape. Meggings tilde hoodie, readymade keffiyeh next level chillwave sartorial vape pitchfork vaporware coloring book kogi truffaut. Freegan PBR&B keffiyeh hell of chicharrones meh fashion axe. Shoreditch vaporware food truck occupy, cray scenester mlkshk man bun.",
    "Four dollar toast cold-pressed pinterest, humblebrag post-ironic master cleanse church-key la croix jianbing snackwave kinfolk. Jianbing copper mug godard tofu tattooed vinyl coloring book. Celiac meggings leggings waistcoat put a bird on it lyft. Pork belly edison bulb af, swag letterpress gentrify kitsch polaroid poke blue bottle. Listicle succulents intelligentsia tousled pork belly. Selfies brooklyn meggings cardigan, migas tumblr vice artisan.",
  ];

  return (
    <div className="App">
      <Helmet
        onChangeClientState={(newState, addedTags, removedTags) => {
          // Render paywall once the lpc json config has been updated
          waitForGlobal('renderPaywall', () => {
            window.renderPaywall();
          });
        }}
      >
        <title>{`Page ${pageId + 1}`}</title>
        <script type="text/javascript">{`
          var renderPaywall;
          var removePaywall;

          function lpcReadyCallback(lpcHandle) {
            console.log('Received lpcHandle:', lpcHandle);
            
            // Define global functions
            renderPaywall = () => {
              lpcHandle.init();
              lpcHandle.fetch();
            }
            removePaywall = () => lpcHandle.reset();
            console.log('Global functions defined.');

            lpcHandle.preventDefault();
          }
        `}</script>
        <script type="application/json" id="laterpay-connector">{`
          {
            "articleId": "react-page-${pageId + 1}",
            ${ !!LP_SECRET ?
              `"configToken": "${createConfigToken(pageId, LP_SECRET)}",` 
            : ''}
            ${ pageId === 1 ?
              `"appearance": {
                "variant": "raw-white"
              },`
            : ''}
            "callbacks": {
              "onReady": "lpcReadyCallback"
            }
          }
        `}</script>
        <script type="text/javascript" src="https://connector-script.laterpay.net/3-stable/eu/sbx/app-en-us.js"></script>
      </Helmet>
      <div className="blogSection">
        <button onClick={ () => handleNextPage() }>
          Click to Switch Page
        </button>
        <h1>Page {pageId + 1}</h1>
        <div className="entry-content">
          <p className="hideMe">
            { pagesData[pageId === 0 ? 0 : 1].substring(0, pagesData[pageId].indexOf('.') + 1) }
          </p>
          <p data-lp-show-on-access className="hideMe">
            { pagesData[pageId === 0 ? 1 : 0] }
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
