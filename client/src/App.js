import { PostCreate, PostList } from './components/post'

function App() {
  return (
    <div className='container'>
      <PostCreate />
      <hr />
      <PostList />
    </div>
  );
}

export default App;
