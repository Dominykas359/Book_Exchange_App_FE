import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AppRoutes } from './utilities/Routes';
import Notices from './components/main/Notices';
import NewNotice from './components/main/NewNotice';
import Notice from './components/main/Notice';
import History from './components/main/History';
import Settings from './components/main/Settings';
import Login from './components/authentication/Login';
import Registration from './components/authentication/Registration';
import Chat from './components/main/Chat';
import Chats from './components/main/Chats';
import ErrorPage from './utilities/ErrorPage';
import Comments from './components/main/Comments';
import ChatFromPublisher from './components/main/ChatFromPublisher';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to={AppRoutes.NOTICES} />} />
        <Route path={AppRoutes.NOTICES} element={<Notices />} />
        <Route path={AppRoutes.NEW_NOTICE} element={<NewNotice />} />
        <Route path={AppRoutes.NOTICE} element={<Notice />} />
        <Route path={AppRoutes.CHATS} element={<Chats />} />
        <Route path={AppRoutes.CHAT} element={<Chat />} />
        <Route path={AppRoutes.CHATPUBLISHER} element={<ChatFromPublisher />} />
        <Route path={AppRoutes.HISTORY} element={<History />} />
        <Route path={AppRoutes.SETTINGS} element={<Settings />} />
        <Route path={AppRoutes.LOG_IN} element={<Login />} />
        <Route path={AppRoutes.SIGN_UP} element={<Registration />} />
        <Route path={AppRoutes.COMMENTS} element={<Comments />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
