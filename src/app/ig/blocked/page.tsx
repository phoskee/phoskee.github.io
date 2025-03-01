'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { Button } from "~/components/ui/button";
import { InstagramProfile, BlockedProfilesData, getUserName, getProfileDate, getProfileLink, extractProfilesFromJson } from "../types";

export default function Page() {
	const [profiles, setProfiles] = useState<InstagramProfile[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files?.[0]) return;
		setIsLoading(true);
		
		try {
			const file = event.target.files[0];
			const json = await file.text();
			const data = JSON.parse(json) as BlockedProfilesData;
			setProfiles(extractProfilesFromJson(data, 'relationships_blocked_users'));
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
					<CardTitle>Profili Bloccati</CardTitle>
					<CardDescription>Carica il tuo file JSON per vedere i profili che hai bloccato</CardDescription>
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

					{isLoading ? (
						<div className="text-center py-4">Caricamento...</div>
					) : (
						<div className="grid gap-4">
							<p className="text-sm text-gray-500">Totale profili bloccati: {profiles.length}</p>
							{profiles.map((profile, index) => (
								<Card key={index}>
									<CardContent className="p-4">
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium">
													{getUserName(profile)}
												</p>
												<p className="text-sm text-gray-500">
													{getProfileDate(profile)?.toLocaleDateString() || 'Data non disponibile'}
												</p>
											</div>
											<Button asChild variant="link">
												<Link href={getProfileLink(profile)} target="_blank">
													Visualizza Profilo
												</Link>
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
} 