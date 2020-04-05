import { useState } from "react"
import { useRouter } from "next/router"
import fetch from "isomorphic-fetch"
import Head from "next/head"
import { Heading, Text, Box } from "@chakra-ui/core"

import MapBrazil from "../components/MapBrazil"
import StateTotalResults from "../components/StateTotalResults"

import municipalities from "../utils/municipalities.json"

const Post = ({ states, cities, history }) => {
	const router = useRouter()
	const { state: stateParam } = router.query
	const [county, setCounty] = useState(stateParam)

	return (
		<div className="container">
			<Head>
				<title>Mapa do COVID-19 no Brasil</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Box
				as="main"
				padding={4}
				width={["100%", 3 / 4, "700px"]}
				margin={[0, "auto"]}
			>
				<Heading as="h1" fontSize="2xl" mt={0}>
					COVID-19 no Brasil
				</Heading>
				<Text fontSize="xl" color="gray.500">
					Selecione um estado para mais detalhes
				</Text>
				<MapBrazil
					results={states}
					selectedState={county}
					onStateSelection={(state) => setCounty(state)}
					cities={cities}
				/>
				<StateTotalResults result={history[0]} />
			</Box>
		</div>
	)
}

export default Post

export async function getStaticProps({ params: { state } }) {
	const { results: states } = await fetch(
		`https://brasil.io/api/dataset/covid19/caso/data?is_last=true&place_type=state`
	).then((data) => data.json())
	const { results } = await fetch(
		`https://brasil.io/api/dataset/covid19/caso/data?is_last=true&place_type=city&state=${state}`
	).then((data) => data.json())
	const cities = results
		// eslint-disable-next-line camelcase
		.filter(({ city_ibge_code }) => !!city_ibge_code)
		.map((result) => {
			const { latitude: lat, longitude: lon } = municipalities.find(
				(m) => `${m.codigo_ibge}` === result.city_ibge_code
			)
			return { ...result, coords: { lat, lon } }
		})
	const { results: history } = await fetch(
		`https://brasil.io/api/dataset/covid19/caso/data?place_type=state&state=${state}`
	).then((data) => data.json())
	return {
		props: { states, cities, history },
	}
}

export async function getStaticPaths() {
	return {
		paths: [
			{ params: { state: "AP" } },
			{ params: { state: "PA" } },
			{ params: { state: "RR" } },
			{ params: { state: "AC" } },
			{ params: { state: "AL" } },
			{ params: { state: "AM" } },
			{ params: { state: "BA" } },
			{ params: { state: "CE" } },
			{ params: { state: "DF" } },
			{ params: { state: "ES" } },
			{ params: { state: "GO" } },
			{ params: { state: "MA" } },
			{ params: { state: "MG" } },
			{ params: { state: "MS" } },
			{ params: { state: "MT" } },
			{ params: { state: "PB" } },
			{ params: { state: "PE" } },
			{ params: { state: "PI" } },
			{ params: { state: "PR" } },
			{ params: { state: "RJ" } },
			{ params: { state: "RN" } },
			{ params: { state: "RO" } },
			{ params: { state: "RS" } },
			{ params: { state: "SC" } },
			{ params: { state: "SE" } },
			{ params: { state: "SP" } },
			{ params: { state: "TO" } },
		],
		fallback: false,
	}
}