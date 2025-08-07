import { NotesListRSC } from '@components/notes-list/rsc'
import { getFeatures } from '@data/site-config'
import { notFound } from 'next/navigation'

const Notes = async () => {
  const features = getFeatures()

  // If notes feature is disabled, return 404
  if (!features.notes) {
    notFound()
  }

  return (
    <NotesListRSC paginate={true} />
  )
}

export default Notes
