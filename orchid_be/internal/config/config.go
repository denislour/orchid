package config

import (
	"log"
	"os"
	"strings"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
}

type ServerConfig struct {
	Port string `mapstructure:"port"`
	Mode string `mapstructure:"mode"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	DBName   string `mapstructure:"dbname"`
	SSLMode  string `mapstructure:"sslmode"`
}

func LoadConfig(path string) (*Config, error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")

	viper.SetDefault("server.port", "8080")
	viper.SetDefault("server.mode", "debug")
	viper.SetDefault("database.host", "localhost")
	viper.SetDefault("database.port", "5432")
	viper.SetDefault("database.sslmode", "disable")

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Printf("Config file not found, using defaults and environment variables: %v", err)
	}

	// Process environment variable substitution for nested configs
	processEnvVarsInViper()

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	return &config, nil
}


// processEnvVar processes environment variable substitution in the format ${VAR:default}
func processEnvVar(value string) string {
	start := strings.Index(value, "${")
	end := strings.Index(value, "}")

	if start == -1 || end == -1 {
		return value
	}

	envVar := value[start+2 : end]
	parts := strings.SplitN(envVar, ":", 2)
	var varName, defaultValue string

	if len(parts) == 2 {
		varName = parts[0]
		defaultValue = parts[1]
	} else {
		varName = parts[0]
	}

	if envValue := os.Getenv(varName); envValue != "" {
		return strings.Replace(value, value[start:end+1], envValue, 1)
	}

	return strings.Replace(value, value[start:end+1], defaultValue, 1)
}


// processEnvVarsInViper processes environment variable substitution for all viper settings
func processEnvVarsInViper() {
	// Process top-level and nested settings
	allSettings := viper.AllSettings()
	for key, value := range allSettings {
		if strValue, ok := value.(string); ok {
			if strings.Contains(strValue, "${") && strings.Contains(strValue, "}") {
				processedValue := processEnvVar(strValue)
				viper.Set(key, processedValue)
			}
		} else if nestedMap, ok := value.(map[string]interface{}); ok {
			// Process nested configurations
			for nestedKey, nestedValue := range nestedMap {
				if strValue, ok := nestedValue.(string); ok {
					if strings.Contains(strValue, "${") && strings.Contains(strValue, "}") {
						processedValue := processEnvVar(strValue)
						viper.Set(key+"."+nestedKey, processedValue)
					}
				}
			}
		}
	}
}
