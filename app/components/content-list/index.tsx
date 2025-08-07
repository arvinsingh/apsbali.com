import FilterableList from "@components/filterable-list"
import getNotes from "@lib/get-notes"
import getPosts from "@lib/get-posts"
import { getFeatures } from "@data/site-config"
import { getTag, renderItem } from "./render-item"
import { Suspense } from "react"


export async function ContentListRSC() {
    const features = getFeatures()

    const [posts, notes] = await Promise.all([
        features.blog ? getPosts(true) : [],
        features.notes ? getNotes() : [],
    ])

    const content = [...posts, ...notes].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    // Don't render if no content is available
    if (content.length === 0) {
        return null
    }

    return <>
        {/* Suspense for useSearchParams */}
        <Suspense fallback={null}>
            <FilterableList
                items={content}
                renderItem={renderItem}
                tags={getTag}
                enableSearch={false}
                enableTags={true}
            />
        </Suspense>
    </>
}