'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { Button } from "~/components/ui/button";
import { InstagramProfile, CloseFriendsData, getUserName, getProfileDate, getProfileLink, extractProfilesFromJson } from "../types";

export default function Page() {
	const [friends, setFriends] = useState<InstagramProfile[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files?.[0]) return;
		setIsLoading(true);
		
		try {
			const file = event.target.files[0];
			const json = await file.text();
			const data = JSON.parse(json) as CloseFriendsData;
			setFriends(extractProfilesFromJson(data, 'relationships_close_friends'));
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
					<CardTitle>Amici Stretti</CardTitle>
					<CardDescription>Carica il tuo file JSON per vedere la lista dei tuoi amici stretti su Instagram</CardDescription>
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
							<p className="text-sm text-gray-500">Totale amici stretti: {friends.length}</p>
							{friends.map((friend, index) => (
								<Card key={index}>
									<CardContent className="p-4">
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium">
													{getUserName(friend)}
												</p>
												<p className="text-sm text-gray-500">
													{getProfileDate(friend)?.toLocaleDateString() || 'Data non disponibile'}
												</p>
											</div>
											<Button asChild variant="link">
												<Link href={getProfileLink(friend)} target="_blank">
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