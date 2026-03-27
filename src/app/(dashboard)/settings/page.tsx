import { getProfile } from '@/app/actions/profile'
import { getT } from '@/i18n'
import ProfileForm from '@/components/settings/profile-form'

export default async function SettingsPage() {
  const t       = getT('es')
  const tk      = t.settings
  const profile = await getProfile()

  return (
    <div className="px-6 md:px-10 py-10 max-w-lg">

      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-2">
          {tk.page.title}
        </p>
        <p className="text-sm text-[#7A6B58]">{tk.page.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4D9CC] p-6 md:p-8">
        <h2 className="font-serif text-lg font-semibold text-[#2A1F14] mb-6">
          {tk.profile.section}
        </h2>
        <ProfileForm profile={profile} translations={tk} />
      </div>
    </div>
  )
}
