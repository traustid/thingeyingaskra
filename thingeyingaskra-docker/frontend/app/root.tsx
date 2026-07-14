import {
	isRouteErrorResponse,
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useNavigate,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { useState } from "react";

import headerLogo from './img/thingeyingaskra.png';

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	const [searchInput, setSearchInput] = useState('');
	const navigate = useNavigate();

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     				integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     				crossOrigin=""/>
			</head>
			<body>

				<div className="relative border-b border-gray-400/20 bg-gray-100 bg-[url(./img/header.jpg)] bg-cover bg-center">

					<div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/80 to-white/50" />

					<div className="relative max-w-[1400px] px-8 md:px-10 mx-auto py-8 md:py-10">
						<Link to={'/'}>
							<h1 className="text-3xl"><img className="max-w-full md:max-w-[350px]" src={headerLogo} /></h1>
							<div className="text-2xl font-bold text-[#714216]">Konráðs Vilhjálmssonar</div>
						</Link>

						<div className="flex gap-4 mt-4 md:mt-10">
							<input onChange={(event) => setSearchInput(event.target.value)} 
								onKeyDown={(event) => {
									if (event.key == 'Enter') {
										navigate('/leit/'+searchInput);
									}
								}}
								value={searchInput} 
								className="grow border-1 bg-white rounded border-gray-500 shadow-lg p-2" 
								type="text" 
								placeholder="Leita að nafni, bæ eða stöðu" />

							<button className="bg-gray-200 border-1 rounded border-gray-400 shadow-lg p-2 px-4 hover:bg-gray-300 hover:shadow-lg transition-all cursor-pointer"
								onClick={() => navigate('/leit/'+searchInput)}
							>Leita</button>
						</div>
					</div>

				</div>

				<div className="max-w-[1400px] mx-auto py-4 md:py-8 px-2 md:px-10">

					{children}

				</div>

				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "Þessi síða finnst ekki."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
