import {Outlet} from "react-router-dom";

function Root() {
    return (
        <>
            <header></header>
            <Outlet/>
            <footer></footer>
        </>
    );
}

export default Root;