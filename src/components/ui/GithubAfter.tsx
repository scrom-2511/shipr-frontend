import { githubAfterInstallationHandler } from '@/src/reqHandlers/project/githubAfterInstallation.reqhandler'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'

const GithubAfter = () => {
    const githubAfterInstallationMutation = useMutation({
        mutationFn: githubAfterInstallationHandler,
        onSuccess: () => {

        },
        onError: () => {

        }
    })

    useEffect(() => {
        const installation_id = new URLSearchParams(window.location.search).get("installation_id")
        const state = new URLSearchParams(window.location.search).get("state")
        if (installation_id && state) {
            githubAfterInstallationMutation.mutate({ installation_id: Number(installation_id), state })
        }
    }, [])

    return (
        <div>GithubAfter</div>
    )
}

export default GithubAfter