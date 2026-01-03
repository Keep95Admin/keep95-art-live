import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ArtistsNavBar from '@/components/ArtistsNavBar';

export default async function ArtistDashboard({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = await createClient();

  if (!supabase) {
    return <div>Supabase client unavailable</div>;
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== id) {
    redirect('/');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, username, profile_picture_url, bio')
    .eq('id', id)
    .single();

  if (profileError || !profile) {
    return <div>Profile not found</div>;
  }

  let profilePictureSrc = null;
  if (profile.profile_picture_url) {
    const { data: signedData, error: signedError } = await supabase.storage
      .from('profiles')
      .createSignedUrl(profile.profile_picture_url, 3600);  // 1hr expiry; adjust as needed
    if (signedError) {
      console.error('Signed URL error:', signedError);
    } else {
      profilePictureSrc = signedData.signedUrl;
    }
  }

  const { data: drops, error: dropsError } = await supabase
    .from('drops')
    .select('id, title, price, image_url')
    .eq('artist_id', id);

  if (dropsError) {
    console.error('Drops fetch error:', dropsError);
  }

  // Generate signed URLs for drop images
  const dropsWithSignedUrls = drops ? await Promise.all(
    drops.map(async (drop) => {
      let dropImageSrc = null;
      if (drop.image_url) {
        const { data: signedData, error: signedError } = await supabase.storage
          .from('drops')
          .createSignedUrl(drop.image_url, 3600);
        if (!signedError) {
          dropImageSrc = signedData.signedUrl;
        }
      }
      return { ...drop, dropImageSrc };
    })
  ) : [];

  return (
    <>
      <ArtistsNavBar />
      <main className="min-h-screen bg-black text-white p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <Link href="/drops" className="text-cyan-400 hover:underline mb-8 inline-block">
            &larr; Back to Drops
          </Link>
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="w-48 h-48 bg-gray-950 rounded-full overflow-hidden border border-gray-800 relative flex-shrink-0">
              {profilePictureSrc ? (
                <Image
                  src={profilePictureSrc}
                  alt={profile.username}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-700 text-6xl font-bold">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-black mb-4">{profile.username}</h1>
              <p className="text-gray-400 mb-6 inline">{profile.bio || 'No bio available.'}</p>
              <Link href="/artist/setup" className="text-cyan-400 hover:underline ml-4">Edit Profile</Link>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black">Your Drops</h2>
            <Link href={`/artist/${id}/new-drop`} className="bg-cyan-500 text-black px-6 py-3 rounded-full font-bold hover:bg-cyan-400">
              Create New Drop
            </Link>
          </div>
          {dropsWithSignedUrls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dropsWithSignedUrls.map((drop) => (
                <div key={drop.id} className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 hover:border-cyan-500 transition-colors">
                  <div className="aspect-square relative">
                    {drop.dropImageSrc ? (
                      <Image
                        src={drop.dropImageSrc}
                        alt={drop.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-700 text-6xl font-bold">
                        ART
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{drop.title}</h3>
                      <p className="text-cyan-400">${drop.price}</p>
                    </div>
                    <Link href={`/drops/${drop.id}/edit`} className="text-cyan-400 hover:underline">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No drops available yet. Create one to get started!</p>
          )}
          <Link href="/dashboard/analytics" className="bg-cyan-500 text-black px-8 py-4 rounded-full font-bold hover:bg-cyan-400 mt-8 inline-block">
            View Analytics
          </Link>
        </div>
      </main>
    </>
  );
}
