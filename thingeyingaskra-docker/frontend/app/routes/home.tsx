import TabContainer from "~/components/TabContainer";
import type { Route } from "./+types/home";
import Persons from "./Persons";
import Places from "./Places";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return <div>
		<TabContainer tabs={[
			{
				'title': 'Einstaklingar',
				'element': <Persons />
			},
			{
				'title': 'Staðir',
				'element': <Places />
			}
		]} />
	</div>
}
