import {createBrowserRouter, RouterProvider} from 'react-router-dom';

//blog nav 버튼을 클릭했을때만 리소스가 다운되도록 lazy loading 설정을 위해 주석처리
// import BlogPage, { loader as postsLoader } from './pages/Blog';
import HomePage from './pages/Home';

//개별 포스트 개시물 lazy loading 설정하기
// import PostPage, {loader as postLoader} from './pages/Post';
import RootLayout from './pages/Root';
import {lazy, Suspense} from "react";

//page lazy loading
const BlogPage = lazy(() => import('./pages/Blog'));
const PostPage = lazy(() => import('./pages/Post'));

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout/>,
        children: [
            {
                index: true,
                element: <HomePage/>,
            },
            {
                path: 'posts',
                children: [
                    {
                        index: true,
                        element: (//suspense 추가 : 페이지 로딩되는 것을 기다리기 위해서!
                            <Suspense fallback={<p>Loading...</p>}>
                                <BlogPage/>
                            </Suspense>
                        ),
                        // for lazy loading dynamic import
                        loader: () =>
                            import('./pages/Blog').then(module =>
                                module.loader())
                    },
                    {
                        path: ':id',
                        element: (
                            <Suspense fallback={<p>Loading...</p>}>
                                <PostPage/>
                            </Suspense>
                        ),
                        loader: ({params}) =>
                            import('./pages/Post').then(module =>
                                module.loader({params}))
                    },
                ],
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router}/>;
}

export default App;
