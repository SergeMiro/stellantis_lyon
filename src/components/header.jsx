import React from 'react';
import Avatars from './header_util/avatar';
import DropdownMenu from './header_util/dropdown_menu';
import NavMenu from './header_util/navigation_menu';

const Header = () => {
	return (
		<header>
			<div className='flex flex-nowrap justify-end gap-5 items-center'>
					<NavMenu />					
					<Avatars />
					<DropdownMenu />		
			</div>
		</header>
	);
};

export default Header;
