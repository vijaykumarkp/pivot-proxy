// Simple Test Component
const TestPortabilityPage = () => {
  return (
    <div style={{ 
      background: 'blue', 
      color: 'white', 
      padding: '20px',
      minHeight: '100vh'
    }}>
      <h1>PIVOT PORTABILITY PAGE IS NOW WORKING!</h1>
      <p>This is a simple test component.</p>
      <button onClick={() => window.location.hash = '#/'}>Back to Home</button>
    </div>
  );
};
