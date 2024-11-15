import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoutesPath, PublicRoutesPath } from "../constants";
import React, { Suspense, } from "react";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <Routes>
          {PublicRoutesPath.map((item, index) => {
            return (
              <Route
                path={item.path}
                key={index}
                element={
                  <Suspense
                    fallback={
                      <div className="global-loader">Global Loading</div>
                    }
                  >
                    {<item.element />}
                  </Suspense>
                }
              />
            );
          })}
          <Route element={<div>Container</div>}>
            {PrivateRoutesPath.map((item, index) => {
              return (
                <Route
                  path={item.path}
                  key={index}
                  element={
                    <Suspense
                      fallback={
                        <div className="global-loader">Global Loading</div>
                      }
                    >
                      {<item.element />}
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </React.Fragment>
    </BrowserRouter>
  );
}
