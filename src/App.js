import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import createConfigToken from './create-config-token.js';
import waitForGlobal from './wait-for-global.js';
import './App.css';

const App = props => {
  const [pageId, setPageId] = useState(1);
  const LP_SECRET = process.env.REACT_APP_LP_SECRET; // Check env variable containing a LaterPay API key

  return (
    <Router>
      <div className="App">
        <Helmet
          onChangeClientState={(newState, addedTags, removedTags) => {
            console.log('<head> rerendered');
            // Render paywall once the lpc json config has been updated
            waitForGlobal('renderPaywall', () => {
              window.renderPaywall();
            });
          }}
        >
          <title>{`Page ${pageId}`}</title>
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
              "articleId": "react-page-${pageId}",
              ${ !!LP_SECRET ?
                `"configToken": "${createConfigToken(pageId, LP_SECRET)}",` 
              : ''}
              ${ pageId > 1 ?
                `"appearance": {
                  "variant": "raw-white",
                  "logoUrl": "https://hfchronicle.com/sites/default/files/holiday%20flag%20v4%20snowman_0.jpg"
                },`
              : ''}
              "callbacks": {
                "onReady": "lpcReadyCallback"
              }
            }
          `}</script>
          <script type="text/javascript" src="https://connector-script.laterpay.net/3-stable/eu/sbx/app-en-us.js"></script>
        </Helmet>
        <Switch>
          <Route path="/lpc-react/page2" render={routeProps => <Page {...routeProps} pageId={ 2 } switchPage={ () => setPageId(1) } />} />
          <Route path="/lpc-react/page1" render={routeProps => <Page {...routeProps} pageId={ 1 } switchPage={ () => setPageId(2) } />} />
          <Route path="/">
            <Redirect to="/lpc-react/page1" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

const Page = ({ history, match, pageId, switchPage }) => {
  const pagesData = [
    "Pitchfork cloud bread before they sold out tacos austin tofu mumblecore cornhole forage direct trade air plant ethical. I'm baby distillery bitters celiac pug pork belly sustainable. 3 wolf moon XOXO hell of occupy woke unicorn farm-to-table deep v taiyaki mixtape. Meggings tilde hoodie, readymade keffiyeh next level chillwave sartorial vape pitchfork vaporware coloring book kogi truffaut. Freegan PBR&B keffiyeh hell of chicharrones meh fashion axe. Shoreditch vaporware food truck occupy, cray scenester mlkshk man bun.",
    "Four dollar toast cold-pressed pinterest, humblebrag post-ironic master cleanse church-key la croix jianbing snackwave kinfolk. Jianbing copper mug godard tofu tattooed vinyl coloring book. Celiac meggings leggings waistcoat put a bird on it lyft. Pork belly edison bulb af, swag letterpress gentrify kitsch polaroid poke blue bottle. Listicle succulents intelligentsia tousled pork belly. Selfies brooklyn meggings cardigan, migas tumblr vice artisan.",
  ];

  const handleClick = () => {
    // Wait for global function
    waitForGlobal('removePaywall', () => {
      // Remove Paywall
      window.removePaywall();
      setTimeout(() => {
        // Update pathname
        history.push({ pathname: `/lpc-react/page${pageId > 1 ? 1 : 2}` });
        // Update pageId state
        switchPage();
      }, 50);
    });
  }

  return (
    <div className="blogSection">
      <button onClick={ () => handleClick() }>
        Click to Switch Page
      </button>
      <h1>Page {pageId}</h1>
      <div className="entry-content">
        <p className="hideMe">
          { pagesData[pageId > 1 ? 1 : 0].substring(0, pagesData[pageId > 1 ? 1 : 0].indexOf('.') + 1) }
        </p>
        <p data-lp-show-on-access className="hideMe">
          { pagesData[pageId > 1 ? 0 : 1] }
        </p>
      </div>
    </div>
  );
}

export default App;
