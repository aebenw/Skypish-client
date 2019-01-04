import React from 'react';
import UserContainer from '../containers/UserContainer'

const Test = () => {
  return (
    <div>
    <div class="container-fluid">
      <div class="row">
        <UserContainer />
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div class="chartjs-size-monitor" style={{
              "position" : "absolute",
              "left" : "0px",
              "top" : "0px",
              "right" : "0px",
              "bottom" : "0px",
              "overflow" : "hidden",
              "pointer-events" : "none",
              "visibility" : "hidden",
              "z-index" : "-1"
            }}>
            <div class="chartjs-size-monitor-expand" style={{
                "position" : "absolute",
                "left" : "0",
                "top" : "0",
                "right" : "0",
                "bottom" : "0",
                "overflow" : "hidden",
                "pointer-events" : "none",
                "visibility" : "hidden",
                "z-index" : "-1"
              }}>
              <div style={{
                  "position" : "absolute",
                  "width" : "1000000px",
                  "height" : "1000000px",
                  "left" : "0",
                  "top" : "0"
                }}></div>
            </div>
            <div class="chartjs-size-monitor-shrink" style={{
                "position" : "absolute",
                "left" : "0",
                "top" : "0",
                "right" : "0",
                "bottom" : "0",
                "overflow" : "hidden",
                "pointer-events" : "none",
                "visibility" : "hidden",
                "z-index" : "-1"
              }}>
              <div style={{
                  "position" : "absolute",
                  "width" : "200%",
                  "height" : "200%",
                  "left" : "0",
                  "top" : "0"
                }}></div>
            </div>
          </div>
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Dashboard</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2">
                <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
                <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
              </div>
              <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                This week
              </button>
            </div>
          </div>

          <canvas class="my-4 w-100 chartjs-render-monitor" id="myChart" width="1556" height="656" style={{
              "display" : "block",
              "height" : "730px",
              "width" : "1730px"
            }}></canvas>

        </main>
      </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script>
      window.jQuery || document.write('<script src="/docs/4.2/assets/js/vendor/jquery-slim.min.js"></script>')
    </script>
    <script src="/docs/4.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-zDnhMsjVZfS3hiP7oCBRmfjkQC4fzxVxFhBx8Hkz2aZX8gEvA/jsP3eXRCvzTofP" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.9.0/feather.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js"></script>
    <script src="dashboard.js"></script>
  </div>)
}

export default Test;
