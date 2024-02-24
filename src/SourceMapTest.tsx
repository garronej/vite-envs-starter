export function SourceMapTest(){

    return (
        <div>
            <h3>Source Map Test</h3>
            <p>Open the browser console to see the source map</p>
            <button onClick={() => {
                throw new Error('Test error');
            }}>Throw test error</button>
        </div>
    );

}