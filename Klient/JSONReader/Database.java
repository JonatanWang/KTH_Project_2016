package jsontest;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

public class Database {

    private Connection con;
    private Date date;

    public Database() {

        System.out.println("model created!");
        connectToDB();
    }

    private void connectToDB() {

        System.out.println("Starting connection to DB.");
        String user = "guest", passw = "guest";
        String database = "arrowhead";
        String server = "jdbc:mysql://localhost:3306/" + database + "?UseClientEnc=UTF8";
        con = null;

        // localhost
        try {

            Class.forName("com.mysql.jdbc.Driver").newInstance();
            con = DriverManager.getConnection(server, user, passw);
            System.out.println("Connected to DB.");
        } catch (Exception e) {

            System.out.println("Database Error " + e.getMessage());
        }
    }//connect

    public void exitConnection() throws SQLException {

        System.out.println("Exiting connection from DB");
        con.close();
    }//disconnect

    public Statistics select(Statistics stat) {

        //search from DB
        String querey = "SELECT * FROM T_STATS";
        Statistics stats = extractInfo(querey);
        return stats;
    }

    @SuppressWarnings("deprecation")
    public void insert(Statistics stat) throws SQLException {

        //add to DB
        date = new Date();
        String sql = "INSERT INTO T_STATISTICS(Season, Snapshot, Accuracy, AccidentalKills," +
                "MissionPercentage, DefendPercentage, AttackPercentage, KD, Enemy) values(?,?,?,?,?,?,?,?,?)";
        PreparedStatement addStats = null;

        try {

            addStats = con.prepareStatement(sql);
            addStats.setDouble(1, stat.getSeason());
            addStats.setInt(2, date.getDate());
            addStats.setDouble(3, stat.getAccuracy());
            addStats.setDouble(4, stat.getAccidentalKills());
            addStats.setDouble(5, stat.missionsPercentage());
            addStats.setDouble(6, stat.defendPercentage());
            addStats.setDouble(7, stat.attackPercentage());
            addStats.setDouble(8, stat.getKD());
            addStats.setDouble(9, stat.getEnemy());
            int n = addStats.executeUpdate();
        }//try
        catch (SQLException e) {

            System.out.println("Exception: Error!");
            e.printStackTrace();
        }//catch
        finally {

            addStats.close();
        }//finally
    }//insert

    @SuppressWarnings("deprecation")
    public void update(Statistics stat) throws SQLException {

        //add to DB
        date = new Date();
        String sql = "UPDATE T_STATISTICS SET Season = ?, Snapshot = ?, Accuracy = ?, AccidentalKills = ?, MissionPercentage = ?, DefendPercentage = ?, AttackPercentage = ?, KD = ? where Enemy = " + stat.getEnemy();
        PreparedStatement addStats = null;

        try {

            addStats = con.prepareStatement(sql);
            addStats.setDouble(1, stat.getSeason());
            addStats.setInt(2, date.getDate());
            addStats.setDouble(3, stat.getAccuracy());
            addStats.setDouble(4, stat.getAccidentalKills());
            addStats.setDouble(5, stat.missionsPercentage());
            addStats.setDouble(6, stat.defendPercentage());
            addStats.setDouble(7, stat.attackPercentage());
            addStats.setDouble(8, stat.getKD());
            int n = addStats.executeUpdate();
        }//try
        catch (SQLException e) {

            System.out.println("Exception: Error!");
            e.printStackTrace();
        }//catch
        finally {

            addStats.close();
        }//finally
    }//insert

    public Statistics extractInfo(String querey) {

        Statistics stats = null;

        try {

            PreparedStatement search = con.prepareStatement(querey);
            ResultSet rs = search.executeQuery();

            while (rs.next()) {
                int kills = rs.getInt("T_STATS.Kills");
                int deaths = rs.getInt("T_STATS.Deaths");
                //stats = new Statistics(kills, deaths);
            }

            search.close();

        } catch (SQLException e) {

            System.out.println("Failed to execute the search method!");
            e.printStackTrace();
        }
        
        return stats;
    }//extract
}
