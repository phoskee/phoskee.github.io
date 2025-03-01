'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

import Link from "next/link"
import { useState } from "react"
import { Button } from "~/components/ui/button";

interface FollowRequest {
	title: string;
	media_list_data: any[];
	string_list_data: {
		href: string;
		value: string;
		timestamp: number;
	}[];
}

export default function Page() {
	const [requests, setRequests] = useState<FollowRequest[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files?.[0]) return;
		setIsLoading(true);
		
		try {
			const file = event.target.files[0];
			const json = await file.text();
			const data = JSON.parse(json);
			setRequests(data.relationships_follow_requests_sent || []);
		} catch (error) {
			console.error('Errore nel caricamento del file:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto py-8">
			<Card>
				<CardHeader>
					<CardTitle>Richieste di Follow in Sospeso</CardTitle>
					<CardDescription>Carica il tuo file JSON per vedere le richieste di follow inviate</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-6">
						<input
							type="file"
							accept=".json"
							onChange={handleFileUpload}
							className="block w-full text-sm text-slate-500
								file:mr-4 file:py-2 file:px-4
								file:rounded-full file:border-0
								file:text-sm file:font-semibold
								file:bg-violet-50 file:text-violet-700
								hover:file:bg-violet-100"
						/>
					</div>

					<div className="grid gap-4">
						{requests.map((request, index) => (
							<Card key={index}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium">
												{request.string_list_data[0]?.value || 'Utente sconosciuto'}
											</p>
											<p className="text-sm text-gray-500">
												{request.string_list_data[0]?.timestamp 
													? new Date(request.string_list_data[0].timestamp * 1000).toLocaleDateString()
													: 'Data non disponibile'
												}
											</p>
										</div>
										<Button asChild variant="link">
											<Link href={request.string_list_data[0]?.href || '#'} target="_blank">
												Visualizza Profilo
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
