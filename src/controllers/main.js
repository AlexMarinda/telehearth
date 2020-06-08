class MainController {
    static home(req, res) {
        res.status(200).json({
            message: 'Hello telehealth'
        })
    }
}
export default MainController