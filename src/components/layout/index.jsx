//index.js
export default function Layout({ config, children }) {

    return (
        <>
            <header></header>
            <main>{children}</main>
            <footer></footer>
        </>
    );
}