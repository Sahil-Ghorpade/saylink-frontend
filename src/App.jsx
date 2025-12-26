import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Feed from "./pages/feed/Feed";
import Profile from "./pages/profile/Profile";
import Notifications from "./pages/notifications/Notifications";
import FollowRequests from "./pages/followRequests/FollowRequests";
import Settings from "./pages/settings/Settings";
import Messages from "./pages/messages/Messages";
import MessageRequests from "./pages/messages/MessageRequests";
import Chat from "./pages/messages/Chat";
import Search from "./pages/search/Search";
import ProtectedRoute from "./components/common/ProtectedRoute";
import SinglePost from "./pages/posts/SinglePost";
import CreatePostPage from "./pages/posts/CreatePostPage";

import MainLayout from "./components/layout/MainLayout";
import NoNavbarLayout from "./components/layout/NoNavbarLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<NoNavbarLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route
                        path="/create"
                        element={
                            <ProtectedRoute>
                                <CreatePostPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/messages/:conversationId"
                        element={
                            <ProtectedRoute>
                                <Chat />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/post/:postId"
                        element={<ProtectedRoute><SinglePost /></ProtectedRoute>}
                    />

                    <Route
                        path="/profile/:username"
                        element={<ProtectedRoute><Profile /></ProtectedRoute>}
                    />

                    <Route
                        path="/settings"
                        element={<ProtectedRoute><Settings /></ProtectedRoute>}
                    
                    />

                </Route>

                <Route element={<MainLayout />}>
                    <Route
                        path="/"
                        element={<ProtectedRoute><Feed /></ProtectedRoute>}
                    />

                    <Route
                        path="/feed"
                        element={<ProtectedRoute><Feed /></ProtectedRoute>}
                    />

                    <Route
                        path="/search"
                        element={<ProtectedRoute><Search /></ProtectedRoute>}
                    />

                    <Route
                        path="/notifications"
                        element={<ProtectedRoute><Notifications /></ProtectedRoute>}
                    />

                    <Route
                        path="/follow-requests"
                        element={<ProtectedRoute><FollowRequests /></ProtectedRoute>}
                    />

                    <Route
                        path="/messages"
                        element={<ProtectedRoute><Messages /></ProtectedRoute>}
                    />

                    <Route
                        path="/messages/requests"
                        element={<ProtectedRoute><MessageRequests /></ProtectedRoute>}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
