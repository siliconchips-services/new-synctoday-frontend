import React, { Suspense } from 'react';
import PageSpinner from './PageSpinner/PageSpinner';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';

const ModuleWrap: React.FC<any> = ({ module: Module, ...rest }) => {
  return (
    <Suspense fallback={<PageSpinner />}>
      <ErrorBoundary description={'Report the Error You Faced'}>
        <div className="mainPageWrap">
          <Module {...rest} />
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};

export default ModuleWrap;

// import React, { Suspense, useEffect, useRef, useState } from 'react';
// import PageSpinner from './PageSpinner/PageSpinner';
// import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';

// const DEBOUNCE_DELAY = 200; // ms

// const ModuleWrap: React.FC<any> = ({ module: Module, ...rest }) => {
//   const [showModule, setShowModule] = useState(false);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     setShowModule(false);
//     if (timerRef.current) clearTimeout(timerRef.current);

//     timerRef.current = setTimeout(() => {
//       setShowModule(true);
//     }, DEBOUNCE_DELAY);

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [Module]);

//   return (
//     <Suspense fallback={<PageSpinner />}>
//       <ErrorBoundary description={'Report the Error You Faced'}>
//         <div className="mainPageWrap">
//           {showModule ? <Module {...rest} /> : <PageSpinner />}
//         </div>
//       </ErrorBoundary>
//     </Suspense>
//   );
// };

// export default ModuleWrap;
