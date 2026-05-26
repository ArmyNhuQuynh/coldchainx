// import Loading from "@/assets/loading/loading"

const LoadingScreen = () => {
    return (
        <div className="relative w-full min-h-[200px]">
            <div className="fixed top-0 left-0 z-50 h-1 w-full overflow-hidden bg-muted">
                <div className="h-full bg-primary animate-progress-bar" />
            </div>
            <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] animate-pulse">
                {/* <Loading className="w-60 h-60" /> */}
            </div>
        </div>
    )
}

export default LoadingScreen