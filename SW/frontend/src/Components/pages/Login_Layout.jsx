import { Outlet } from 'react-router-dom';
import {  Container } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Login from '../Login/Login';
const Login_Layout = () => {
	const location = useLocation();

	return (
		<Container>
            <Login></Login>
			<Outlet></Outlet>
		</Container>
	);
};

export default Login_Layout;
