import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store'; // Correct path to your store
import Home from './pages/Home'
import Login from './pages/Login'
import Chat from './pages/Chat'
import ChatMessage from './pages/ChatMessage'
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Connect from './checking/Connect';
// import Form from './checking/Form';
// import ChatsList from './checking/ChatsList';
// import ChatMessages from './checking/ChatMessages';
// import Logout from './checking/Logout';
// import AskQuestionComponent from './checking/askQuestion';

const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <Home />
  // },
  // {
  //   path: '/login',
  //   element: <Login />
  // },
  // {
  //   path: '/connect',
  //   element: <Connect />
  // },
  // {
  //   path: '/form',
  //   element: <Form />
  // },
  // {
  //   path: '/chats',
  //   element: <ChatsList />
  // },
  // {
  //   path: '/messages/:chatId',
  //   element: <ChatMessages />
  // },
  // {
  //   path: '/logout',
  //   element: <Logout />
  // },
  // {
  //   path: '/ask-question/:chatId',
  //   element: <AskQuestionComponent />
  // }

  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/chat',
    element: <Chat />
  },
  {
    path: '/messages/:chatId',
    element: <ChatMessage />
  }
]);

function App() {
  return (
    <Provider store={store}>
      <div >
        <RouterProvider router={router} />
      </div>
    </Provider>
  );
}

export default App;
